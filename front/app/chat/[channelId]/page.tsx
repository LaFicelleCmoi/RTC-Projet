'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import '../../../styles/channel.css';

type Msg =
  | { kind: "system"; text: string }
  | { kind: "room"; sender: string; text: string };

let typingTimeout: any = null;

export default function ChatPage() {
  const { channelId } = useParams();
  const router = useRouter();

  const [serverId, setServerId] = useState<string>("");
  const [channelName, setChannelName] = useState("");

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  const [users, setUsers] = useState<string[]>([]);
  const [typingText, setTypingText] = useState("");

  const sock = useRef<Socket | null>(null);
  const joinedRef = useRef(false);

  // fetch nom du channel + server_id
  useEffect(() => {
    const fetchChannel = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/connexion");

      try {
        const res = await fetch(`http://localhost:3001/api/servers/channel/${channelId}`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Erreur serveur");

        const data = await res.json();
        setChannelName(data.data.name);
        setServerId(data.data.server_id);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer le channel");
      }
    };

    fetchChannel();
  }, [channelId, router]);

  // supprimer le channel
  const handleDeleteChannel = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`http://localhost:3001/api/servers/channel/${channelId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      alert("Vous avez supprimé le channel");
      router.push(`/channel/${serverId}`);
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le channel");
    }
  };

  // quitter channel (leave + retour page précédente)
  const leaveChannel = () => {
    const s = sock.current;
    if (!s) return;

    s.emit("leave channel", String(channelId));
    joinedRef.current = false;

    s.disconnect();
    router.push(`/channel/${serverId}`);
  };

  // SOCKET.IO 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 1) créer la connexion socket + passer le token
    const s = io("http://localhost:3001", {
      auth: { token },
      autoConnect: false,
    });

    sock.current = s;

    // event listeners

    // messages system
    s.on("system", (m: string) => {
      setMsgs((prev) => [...prev, { kind: "system", text: String(m) }]);
    });

    // message chat
    s.on("channel message", (p: { msg: string; sender: string }) => {
      setMsgs((prev) => [
        ...prev,
        { kind: "room", sender: String(p.sender), text: String(p.msg) },
      ]);
    });

    // liste des users co 
    s.on("channel users", (data: any) => {
      setUsers(Array.isArray(data.users) ? data.users : []);
    });

    // typing : affiche/efface
    s.on("typing", (data: any) => {
      setTypingText(data.isTyping ? `${data.user} est en train d'écrire...` : "");
    });

    // se connecter puis join le channel
    s.connect();
    s.emit("join channel", String(channelId));
    joinedRef.current = true;

    // leave + disconnect
    return () => {
      if (joinedRef.current) {
        s.emit("leave channel", String(channelId));
        joinedRef.current = false;
      }
      s.disconnect();
    };
  }, [channelId]);

  // typing avec debounce (simple)
  const handleTyping = (value: string) => {
    setText(value);

    const s = sock.current;
    if (!s) return;

    // typing info
    s.emit("typing", { channelId, isTyping: true });

    // repousse le to 
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      // stop
      s.emit("typing", { channelId, isTyping: false });
    }, 900);
  };

  // envoyer message
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg) return;

    sock.current?.emit("channel message", { channelId: String(channelId), msg });

    // stop typing après envoi
    sock.current?.emit("typing", { channelId, isTyping: false });

    setText("");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{channelName}</h1>
        <button onClick={leaveChannel} style={{ padding: "6px 10px" }}>
          Leave
        </button>
      </div>

      <div>
        <button onClick={handleDeleteChannel}>Supprimer un channel</button>
      </div>

      <div>
        <strong>Utilisateurs :</strong> {users.join(", ") || "..."}
      </div>

      {typingText && (
        <div>
          {typingText}
        </div>
      )}

      <div>
        <ul>
          {msgs.map((m, i) => (
            <li key={i}>
              {m.kind === "system" ? (
                <div>[system] {m.text}</div>
              ) : (
                <div>
                  <div>{m.sender}</div>
                  <div>{m.text}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={send}>
        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Message…"
        />
        <button type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
