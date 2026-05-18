"use client";

import { useState } from "react";

export default function Home() {

    // File State
    const [file, setFile] = useState(null);

    // Processed Output File
    const [outputFile, setOutputFile] = useState("");

    // Chat Input
    const [message, setMessage] = useState("");

    // Chat Messages
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

        // Create FormData
        const formData = new FormData();

        formData.append("file", file);

        try {

            // Send file to backend
            const response = await fetch(
                "http://127.0.0.1:8000/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            alert("File uploaded successfully");

            // Save output filename
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

        // Open download URL
        window.open(
            `http://127.0.0.1:8000/download/${outputFile}`
        );

    };


    // Send message to backend
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

            // Add bot response
            setChatMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: data.reply
                }
            ]);

            // Clear input
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

                {/* Upload Box */}
                <div className="upload-box">

                    <h2>Upload Document</h2>

                    <input
                        type="file"
                        id="fileInput"
                        onChange={handleFileChange}
                    />

                    <button
                        id="uploadBtn"
                        onClick={uploadFile}
                    >
                        Upload File
                    </button>

                </div>


                {/* Processed File */}
                <div className="processed-box">

                    <h2>Processed Document</h2>

                    <p>

                        {
                            outputFile
                            ?
                            outputFile
                            :
                            "Your processed file will appear here."
                        }

                    </p>

                    <button
                        id="downloadBtn"
                        onClick={downloadFile}
                    >
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
                                    ?
                                    "message user"
                                    :
                                    "message bot"
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