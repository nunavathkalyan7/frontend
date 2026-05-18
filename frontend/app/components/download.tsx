"use client";

import styles from "../styles/download.module.css";

interface DownloadProps {

    outputFile: string;

    downloadFile: () => void;
}

export default function DownloadSection({

    outputFile,
    downloadFile

}: DownloadProps) {

    return (

        <div className={styles.card}>

            <h2 className={styles.heading}>
                Processed Document
            </h2>

            <p className={styles.description}>
                Download your processed document after upload.
            </p>

            {
                outputFile ? (

                    <div className={styles.fileBox}>

                        <p className={styles.fileName}>
                            {outputFile}
                        </p>

                    </div>

                ) : (

                    <div className={styles.noFile}>

                        No processed document available

                    </div>
                )
            }

            <button
                className={styles.button}
                onClick={downloadFile}
                disabled={!outputFile}
            >
                Download File
            </button>

        </div>
    );
}