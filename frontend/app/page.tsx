"use client";

import { useState } from "react";
import "./p11.css";

export default function Home() {

    const [file, setFile] = useState(null);

    const [outputFile, setOutputFile] = useState("");

    const [message, setMessage] = useState("");

    const [chatMessages, setChatMessages] = useState([
        {
            sender: "bot",
            text: "Hello! Upload a document and ask questions."
        }
    ]);


    // Handle File Selection
    const handleFileChange = (event) => {

        setFile(event.target.files[0]);
    };


    // Upload File
    const uploadFile = async () => {

        if (!file) {

            alert("Please select a file");

            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            alert("File uploaded successfully");

            setOutputFile(data.output_file);

        } catch (error) {

            console.log(error);

            alert("Upload failed");
        }
    };


    // Download Processed File
    const downloadFile = () => {

        if (!outputFile) {

            alert("No processed file available");

            return;
        }

        window.open(
            `http://127.0.0.1:8000/download/${outputFile}`
        );
    };


    // Send Chat Message
    const sendMessage = async () => {

        if (!message) return;

        // Add user message
        setChatMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: message
            }
        ]);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );

            const data = await response.json();

            // Add bot reply
            setChatMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: data.reply
                }
            ]);

            setMessage("");

        } catch (error) {

            console.log(error);
        }
    };


    return (

        <div className="container">

            {/* LEFT PANEL */}
            <div className="left-panel">

                <h1>Document AI Assistant</h1>

                {/* Upload Section */}
                <div className="upload-box">

                    <h2>Upload Document</h2>

                    <input
                        type="file"
                        onChange={handleFileChange}
                    />

                    <button onClick={uploadFile}>
                        Upload File
                    </button>

                </div>


                {/* Processed File */}
                <div className="processed-box">

                    <h2>Processed Document</h2>

                    <p>
                        {
                            outputFile
                            ? outputFile
                            : "Your processed file will appear here."
                        }
                    </p>

                    <button onClick={downloadFile}>
                        Download Processed File
                    </button>

                </div>

            </div>


            {/* RIGHT PANEL */}
            <div className="right-panel">

                <div className="chat-header">

                    <h2>Chat With Document</h2>

                </div>


                {/* Chat Messages */}
                <div className="chat-box">

                    {
                        chatMessages.map((msg, index) => (

                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                    ? "message user"
                                    : "message bot"
                                }
                            >

                                {msg.text}

                            </div>
                        ))
                    }

                </div>


                {/* Chat Input */}
                <div className="chat-input-area">

                    <input
                        type="text"
                        placeholder="Ask something about the document..."

                        value={message}

                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                    />

                    <button onClick={sendMessage}>
                        Send
                    </button>

                </div>

            </div>

        </div>
    );
}