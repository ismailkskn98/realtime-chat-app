import victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { setUser } from "@/store/features/auth/authSlice";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateSignup = () => {
    if (!email.trim().length) {
      toast.error("Email alanı boş bırakılamaz.");
      return false;
    }
    if (!password.trim().length) {
      toast.error("Şifre alanı boş bırakılamaz.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return false;
    }
    return true;
  };
  const validateLogin = () => {
    if (!email.trim().length) {
      toast.error("Email alanı boş bırakılamaz.");
      return false;
    }
    if (!password.trim().length) {
      toast.error("Şifre alanı boş bırakılamaz.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setIsLoading(true);
      const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
      setIsLoading(false);
      if (response.data.user.id) {
        dispatch(setUser(response.data.user));
        if (!response.data.user.profileSetup) {
          return navigate("/profile");
        }
        navigate("/chat");
      }
    }
  };
  const handleSignup = async () => {
    if (validateSignup()) {
      setIsLoading(true);
      const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
      setIsLoading(false);
      if (response.status === 201) {
        dispatch(setUser(response.data.user));
        navigate("/profile");
      }
    }
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <main className="h-5/6 w-11/12 md:w-5/6 lg:w-3/4 xl:w-3/5 bg-white shadow-2xl rounded-xl grid 2xl:grid-cols-2">
        <article className="flex flex-col items-center justify-end xl:justify-center">
          <div className="flex items-center justify-center">
            <h1 className="text-black/90 text-5xl font-bold lg:text-6xl">Hoş Geldiniz</h1>
            <img src={victory} alt="victory emoji" className="h-[100px]" />
          </div>
          <p className="text-black/90 font-medium text-sm xl:text-base text-center">En iyi sohbet uygulamasını kullanmak için bilgileri doldurun!</p>
        </article>
        <article className="w-full flex items-center justify-center">
          <Tabs className="w-3/4" defaultValue="login">
            <TabsList className="w-full bg-transparent rounded-none mb-8">
              <TabsTrigger
                value="login"
                disabled={isLoading}
                className="w-full text-black text-opacity-90 border-b-2 rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-lg data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-black p-3 transition-all duration-300 ease-in-out"
              >
                Giriş Yap
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                disabled={isLoading}
                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full  data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-black p-3 transition-all duration-300 ease-in-out"
              >
                Üye Ol
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="flex flex-col items-start">
              <form className="w-full flex flex-col items-start gap-5" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="E-posta" type="email" autoComplete="username" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                <Input
                  placeholder="Şifre"
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin} className="w-full">
                  {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="flex flex-col items-start">
              <form className="w-full flex flex-col items-start gap-5" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="E-posta" type="email" autoComplete="username" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                <Input
                  placeholder="Şifre"
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Şifreyi Onayla"
                  autoComplete="current-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={handleSignup} className="w-full">
                  {isLoading ? "Üye Olunuyor..." : "Üye Ol"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </article>
      </main>
    </section>
  );
}
