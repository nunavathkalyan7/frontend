"use client";

import { useState } from "react";
import "./globals.css";

export default function Home() {

    // =========================
    // STATES
    // =========================

    const [file, setFile] = useState<File | null>(null);

    const [jobId, setJobId] = useState("");

    const [message, setMessage] = useState("");

    const [chatMessages, setChatMessages] = useState([
        {
            sender: "bot",
            text: "Hello! Upload a document and ask questions."
        }
    ]);



    // =========================
    // UPLOAD FILE API
    // =========================

    const uploadFile = async () => {

        if (!file) {

            alert("Please select a file");

            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            const response = await fetch(
                "http://192.168.75.155:8000/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            console.log(data);

            setJobId(data.job_id);

            alert("File uploaded successfully");

        } catch (error) {

            console.log(error);

            alert("Upload failed");
        }
    };



    // =========================
    // DOWNLOAD FILE
    // =========================

    const downloadFile = () => {

        if (!jobId) {

            alert("No processed document available");

            return;
        }

        window.open(
            `http://192.168.75.155:8000/docx/${jobId}`
        );
    };



    // =========================
    // SEND CHAT MESSAGE
    // =========================

    const sendMessage = async () => {

        if (!message.trim()) return;

        if (!jobId) {

            alert("Please upload document first");

            return;
        }

        const currentMessage = message;

        setMessage("");

        // Add user message
        setChatMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: currentMessage
            }
        ]);

        try {

            const response = await fetch(
                `http://192.168.75.155:8000/chat/${jobId}?question=${encodeURIComponent(currentMessage)}`,
                {
                    method: "GET"
                }
            );

            const data = await response.json();

            console.log(data);

            // Add bot response
            setChatMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: data.answer
                }
            ]);

        } catch (error) {

            console.log(error);
        }
    };



    // =========================
    // UI
    // =========================

    return (

        <div className="mainContainer">


            {/* HEADER */}

            <div className="topHeader">

                <h1 className=" mainHeading">
                    AI Assistant
                </h1>

            </div>



            {/* BODY */}

            <div className="bodyContainer">


                {/* LEFT SECTION */}

                <div className="leftSection">


                    {/* UPLOAD SECTION */}

                    <div className="card">

                        <h2 className="heading">
                            Upload Document
                        </h2>

                        <div className="uploadArea">

                            <input
                                type="file"
                                id="fileUpload"
                                className="fileInput"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                            />

                            <label
                                htmlFor="fileUpload"
                                className="uploadLabel"
                            >
                                Choose File
                            </label>

                            {
                                file &&
                                <p className="fileName">
                                    {file.name}
                                </p>
                            }

                        </div>

                        <button
                            className="button"
                            onClick={uploadFile}
                        >
                            Upload File
                        </button>

                    </div>



                    {/* DOWNLOAD SECTION */}

                    <div className="card">

                        <h2 className="heading">
                            Processed Document
                        </h2>

                        <p className="description">
                            Download your processed document after upload.
                        </p>

                        {
                            jobId ? (

                                <div className="fileBox">

                                    <p className="fileName">
                                        {jobId}
                                    </p>

                                </div>

                            ) : (

                                <div className="noFile">

                                    No processed document available

                                </div>
                            )
                        }

                        <button
                            className="button"
                            onClick={downloadFile}
                            disabled={!jobId}
                        >
                            Download File
                        </button>

                    </div>

                </div>



                {/* RIGHT SECTION */}

                <div className="rightSection">


                    {/* CHAT CONTAINER */}

                    <div className="chatContainer">


                        {/* CHAT HEADER */}

                        <div className="chatHeader">

                            <h2>
                                Chat With Document
                            </h2>

                        </div>



                        {/* CHAT MESSAGES */}

                        <div className="chatBox">

                            {
                                chatMessages.map((msg, index) => (

                                    <div
                                        key={index}
                                        className={`message ${
                                            msg.sender === "user"
                                                ? "user"
                                                : "bot"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>

                                ))
                            }

                        </div>



                        {/* CHAT INPUT */}

                        <div className="chatInputArea">

                            <input
                                type="text"
                                placeholder="Ask something about the document..."
                                className="chatInput"
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
                                className="sendButton"
                                onClick={sendMessage}
                            >
                                Send
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}