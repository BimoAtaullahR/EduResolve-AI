"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { MessageSquare, Send, CheckCircle, AlertCircle, Loader2, HelpCircle, BookOpen, CreditCard, Settings } from "lucide-react";
import { auth } from "@/lib/firebase/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

// Issue categories for EdTech
const issueCategories = [
  { id: "exam", label: "Ujian & Tugas", icon: BookOpen, description: "Masalah terkait kuis, ujian, atau pengumpulan tugas" },
  { id: "payment", label: "Pembayaran", icon: CreditCard, description: "Masalah pembayaran, langganan, atau refund" },
  { id: "access", label: "Akses Materi", icon: Settings, description: "Tidak bisa mengakses video atau materi kursus" },
  { id: "other", label: "Lainnya", icon: HelpCircle, description: "Pertanyaan atau masalah umum lainnya" },
];

export default function AskSupportPage() {
  const { userProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; ticketId?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !selectedCategory) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Get Firebase ID token for authentication
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setSubmitResult({ success: false, error: "Silakan login terlebih dahulu" });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${API_URL}/student/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_name: userProfile?.displayName || "Anonymous Student",
          text: `[${issueCategories.find((c) => c.id === selectedCategory)?.label}] ${message}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitResult({ success: true, ticketId: data.ticket_id });
        setMessage("");
        setSelectedCategory(null);
      } else {
        setSubmitResult({ success: false, error: data.error || "Gagal mengirim pesan" });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitResult({ success: false, error: "Koneksi gagal. Coba lagi nanti." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitResult(null);
    setMessage("");
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-great-blue py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Butuh Bantuan?</h1>
          <p className="text-gray-600">Tim Customer Support kami siap membantu kamu 24/7</p>
        </div>

        {/* Success State */}
        {submitResult?.success && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-200 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h2>
            <p className="text-gray-600 mb-4">Tim kami akan segera meninjau dan membalas pesanmu.</p>
            <button onClick={resetForm} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
              Kirim Pesan Lainnya
            </button>
          </div>
        )}

        {/* Form */}
        {!submitResult?.success && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Kategori Masalah</label>
                <div className="grid grid-cols-2 gap-3">
                  {issueCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-900"}`}>{category.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 pl-13">{category.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Jelaskan Masalahmu
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ceritakan secara detail apa yang terjadi. Sertakan informasi seperti nama kursus, waktu kejadian, atau pesan error jika ada..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-2">Minimal 20 karakter • {message.length}/500</p>
              </div>

              {/* Error Message */}
              {submitResult?.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{submitResult.error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedCategory || message.length < 20 || isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                  !selectedCategory || message.length < 20 || isSubmitting ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>

            {/* Help Tips */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tips untuk mendapat bantuan lebih cepat:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Sertakan nama kursus atau materi yang bermasalah
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Jelaskan langkah-langkah yang sudah kamu coba
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Jika ada pesan error, salin dan tempel pesannya
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Rata-rata waktu respons: <span className="font-medium text-gray-700">30 menit</span>
          </p>
        </div>
      </div>
    </div>
  );
}
