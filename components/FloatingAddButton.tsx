"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
    href?: string;
    onClick?: () => void;
}

export default function FloatingAddButton({ href, onClick }: FloatingAddButtonProps) {
    const buttonContent = (
        <motion.div
            className="fab w-16 h-16 bottom-24 right-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.2
            }}
        >
            <Plus size={32} strokeWidth={2.5} className="text-white" />
        </motion.div>
    );

    if (href) {
        return <Link href={href}>{buttonContent}</Link>;
    }

    return (
        <button onClick={onClick} className="focus:outline-none">
            {buttonContent}
        </button>
    );
}
