"use client";

import styles from "../styles/chatbox.module.css";

interface Message {

    sender: string;

    text: string;
}

interface ChatBoxProps {

    chatMessages: Message[];

    message: string;

    setMessage: React.Dispatch<React.SetStateAction<string>>;

    sendMessage: () => void;
}

export default function ChatBox({

    chatMessages,
    message,
    setMessage,
    sendMessage

}: ChatBoxProps) {

    return (

        <div className={styles.chatContainer}>


            {/* HEADER */}

            <div className={styles.chatHeader}>

                <h2>
                    Chat With Document
                </h2>

            </div>



            {/* CHAT MESSAGES */}

            <div className={styles.chatBox}>

                {
                    chatMessages.map((msg, index) => (

                        <div
                            key={index}
                            className={`${styles.message} ${
                                msg.sender === "user"
                                    ? styles.user
                                    : styles.bot
                            }`}
                        >
                            {msg.text}
                        </div>

                    ))
                }

            </div>



            {/* INPUT AREA */}

            <div className={styles.chatInputArea}>

                <input
                    type="text"
                    placeholder="Ask something about the document..."
                    className={styles.chatInput}
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            e.preventDefault();

                            sendMessage();
                        }
                    }}
                />

                <button
                    className={styles.sendButton}
                    onClick={sendMessage}
                >
                    Send
                </button>

            </div>

        </div>
    );
}