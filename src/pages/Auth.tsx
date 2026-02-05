 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { ArrowLeft, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
 import { Alert, AlertDescription } from "@/components/ui/alert";
 import { z } from "zod";
 
 const emailSchema = z.string().email("Please enter a valid email address");
 const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
 
 const Auth = () => {
   const navigate = useNavigate();
   const { user, signIn, signUp, loading: authLoading } = useAuth();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [message, setMessage] = useState<string | null>(null);
 
   useEffect(() => {
     if (user) {
       navigate("/");
     }
   }, [user, navigate]);
 
   const validateInputs = () => {
     try {
       emailSchema.parse(email);
     } catch {
       setError("Please enter a valid email address");
       return false;
     }
     try {
       passwordSchema.parse(password);
     } catch {
       setError("Password must be at least 6 characters");
       return false;
     }
     return true;
   };
 
   const handleSignIn = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null);
     setMessage(null);
     
     if (!validateInputs()) return;
     
     setLoading(true);
     const { error } = await signIn(email, password);
     setLoading(false);
 
     if (error) {
       if (error.message.includes("Invalid login credentials")) {
         setError("Invalid email or password. Please try again.");
       } else if (error.message.includes("Email not confirmed")) {
         setError("Please verify your email address before signing in.");
       } else {
         setError(error.message);
       }
     }
   };
 
   const handleSignUp = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null);
     setMessage(null);
     
     if (!validateInputs()) return;
     
     setLoading(true);
     const { error } = await signUp(email, password);
     setLoading(false);
 
     if (error) {
       if (error.message.includes("already registered")) {
         setError("This email is already registered. Please sign in instead.");
       } else {
         setError(error.message);
       }
     } else {
       setMessage("Check your email for the confirmation link to complete registration.");
     }
   };
 
   if (authLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
       </div>
     );
   }
 
   return (
     <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
       <div className="w-full max-w-md">
         <Button 
           variant="ghost" 
           className="mb-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
           onClick={() => navigate("/")}
         >
           <ArrowLeft className="w-4 h-4 mr-2" />
           Back to Home
         </Button>
         
         <Card className="card-shadow">
           <CardHeader className="text-center">
             <CardTitle className="text-2xl font-display">Welcome</CardTitle>
             <CardDescription>Sign in to save and manage your resumes</CardDescription>
           </CardHeader>
           
           <Tabs defaultValue="signin" className="w-full">
             <TabsList className="grid w-full grid-cols-2 mx-6 max-w-[calc(100%-48px)]">
               <TabsTrigger value="signin">Sign In</TabsTrigger>
               <TabsTrigger value="signup">Sign Up</TabsTrigger>
             </TabsList>
             
             <TabsContent value="signin">
               <form onSubmit={handleSignIn}>
                 <CardContent className="space-y-4 pt-4">
                   {error && (
                     <Alert variant="destructive">
                       <AlertCircle className="h-4 w-4" />
                       <AlertDescription>{error}</AlertDescription>
                     </Alert>
                   )}
                   <div className="space-y-2">
                     <Label htmlFor="signin-email">Email</Label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         id="signin-email"
                         type="email"
                         placeholder="you@example.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="signin-password">Password</Label>
                     <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         id="signin-password"
                         type="password"
                         placeholder="••••••••"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button type="submit" className="w-full" disabled={loading}>
                     {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                     Sign In
                   </Button>
                 </CardFooter>
               </form>
             </TabsContent>
             
             <TabsContent value="signup">
               <form onSubmit={handleSignUp}>
                 <CardContent className="space-y-4 pt-4">
                   {error && (
                     <Alert variant="destructive">
                       <AlertCircle className="h-4 w-4" />
                       <AlertDescription>{error}</AlertDescription>
                     </Alert>
                   )}
                   {message && (
                     <Alert>
                       <Mail className="h-4 w-4" />
                       <AlertDescription>{message}</AlertDescription>
                     </Alert>
                   )}
                   <div className="space-y-2">
                     <Label htmlFor="signup-email">Email</Label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         id="signup-email"
                         type="email"
                         placeholder="you@example.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="signup-password">Password</Label>
                     <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         id="signup-password"
                         type="password"
                         placeholder="••••••••"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button type="submit" className="w-full" disabled={loading}>
                     {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                     Create Account
                   </Button>
                 </CardFooter>
               </form>
             </TabsContent>
           </Tabs>
         </Card>
       </div>
     </div>
   );
 };
 
 export default Auth;