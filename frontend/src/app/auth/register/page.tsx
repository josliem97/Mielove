"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRegister, apiLogin } from "@/lib/api"; 

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRegister(formData.email, formData.username, formData.password);
      // auto login after register
      const res = await apiLogin(formData.username, formData.password);
      localStorage.setItem("access_token", res.access_token);
      localStorage.removeItem("mielove_token"); // Clean up old token
      router.push("/dashboard");
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Lỗi đăng ký.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-10 rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif text-stone-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-stone-600">
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Đăng nhập
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
