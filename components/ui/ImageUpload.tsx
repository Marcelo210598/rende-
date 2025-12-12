"use client";

import { useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";
import { motion } from "framer-motion";

interface ImageUploadProps {
    currentImage?: string;
    onImageChange: (base64Image: string) => void;
    size?: number;
}

export default function ImageUpload({ currentImage, onImageChange, size = 120 }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImage(file);
        }
    };

    const processImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Create canvas to resize image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set canvas size
                const maxSize = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                onImageChange(base64);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleClick}
                className="relative cursor-pointer"
                style={{ width: size, height: size }}
            >
                {currentImage ? (
                    <img
                        src={currentImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-primary/30"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-3xl font-bold border-4 border-primary/30">
                        ?
                    </div>
                )}

                {/* Overlay on hover */}
                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"
                    >
                        <Camera className="w-8 h-8 text-white" />
                    </motion.div>
                )}

                {/* Camera icon badge */}
                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-background">
                    <Upload className="w-5 h-5" />
                </div>
            </motion.div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <p className="text-sm text-gray-400">Clique para alterar foto</p>
        </div>
    );
}
