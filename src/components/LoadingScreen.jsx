import { motion } from "framer-motion";

export default function LoadingScreen({ label = "Đang tải..." }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4 rounded-3xl bg-white px-8 py-10 shadow-soft"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </motion.div>
    </div>
  );
}
