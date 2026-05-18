"use client";

import { useState } from "react";

import "./globals.css";

import Header from "./components/header";
import UploadSection from "./components/upload";
import DownloadSection from "./components/download";
import ChatBox from "./components/chatbox";

export default function Home() {

    // =========================
    // STATES
    // =========================

    // Uploaded File
    const [file, setFile] = useState<File | null>(null);

    // Backend Job ID
    const [jobId, setJobId] = useState("");

    // Chat Input
    const [message, setMessage] = useState("");

    // Chat Messages
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

            // Save backend job_id
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

        // Upload first check
        if (!jobId) {

            alert("Please upload document first");

            return;
        }

        // Store current message
        const currentMessage = message;

        // Clear input instantly
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


            // Add bot reply
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



    return (

        <div className="mainContainer">


            {/* HEADER */}

            <div className="topHeader">

                <Header />

            </div>



            {/* BODY */}

            <div className="bodyContainer">


                {/* LEFT SECTION */}

                <div className="leftSection">

                    <UploadSection
                        file={file}
                        setFile={setFile}
                        uploadFile={uploadFile}
                    />

                    <DownloadSection
                        outputFile={jobId}
                        downloadFile={downloadFile}
                    />

                </div>



                {/* RIGHT SECTION */}

                <div className="rightSection">

                    <ChatBox
                        chatMessages={chatMessages}
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                    />

                </div>

            </div>

        </div>
    );
}