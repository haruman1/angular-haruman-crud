import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast({ title: "Berhasil", description: "Login berhasil!" });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Login gagal",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password
      );
      toast({ title: "Berhasil", description: "Registrasi berhasil!" });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Registrasi gagal",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">

      {/* Bagian Kanan */}
      <div className="flex flex-col justify-center p-10 bg-white">
        <h1 className="text-4xl font-bold mb-3">Welcome to</h1>
        <h2 className="text-5xl font-extrabold text-teal-700">
          Manajemen Barang
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          Aplikasi ini merupakan sistem manajemen barang modern & mudah digunakan.
        </p>

        <img
          src="src\img\Gambar Bagian Depan.png"
          alt="illustration"
          className="w-80 mt-10 mx-auto"
        />
      </div>

      {/* Bagian Kiri */}
      <div className="flex items-center justify-center p-8" style={{ backgroundColor: "#21BAA7" }}>
        <Card className="w-full max-w-md shadow-xl rounded-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Masuk"}
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label>Nama Lengkap</Label>
                    <Input
                      type="text"
                      placeholder="Nama lengkap"
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Daftar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
