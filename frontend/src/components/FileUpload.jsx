import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const FileUpload = ({ onFileSelect, isLoading, label = "Upload Plant Image" }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
        }
    };

    return (
        <div 
            className="glass-panel"
            style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                borderStyle: 'dashed', 
                borderWidth: '2px', 
                borderColor: 'rgba(255,255,255,0.2)',
                cursor: 'pointer'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
                style={{ display: 'none' }}
            />
            
            {preview ? (
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                    <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px', display: 'block', margin: '0 auto' }} />
                    {isLoading && (
                        <div style={{ 
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                            background: 'rgba(0,0,0,0.7)', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center' 
                        }}>
                            <FaSpinner className="spinner" size={40} color="var(--primary)" />
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                    <FaCloudUploadAlt size={48} color="var(--text-muted)" />
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{label}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Drag & drop or click to select</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
