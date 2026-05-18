"use client";

import styles from "../styles/upload.module.css";

interface UploadProps {

    file: File | null;

    setFile: React.Dispatch<React.SetStateAction<File | null>>;

    uploadFile: () => void;
}

export default function UploadSection({

    file,
    setFile,
    uploadFile

}: UploadProps) {

    return (

        <div className={styles.card}>

            <h2 className={styles.heading}>
                Upload Document
            </h2>

            <div className={styles.uploadArea}>

                <input
                    type="file"
                    id="fileUpload"
                    className={styles.fileInput}
                    onChange={(e) =>
                        setFile(e.target.files?.[0] || null)
                    }
                />

                <label
                    htmlFor="fileUpload"
                    className={styles.uploadLabel}
                >
                    Choose File
                </label>

                {
                    file &&
                    <p className={styles.fileName}>
                        {file.name}
                    </p>
                }

            </div>

            <button
                className={styles.button}
                onClick={uploadFile}
            >
                Upload File
            </button>

        </div>
    );
}