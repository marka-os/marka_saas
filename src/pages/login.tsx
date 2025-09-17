import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap, ArrowLeft } from "lucide-react";

import { Button } from "@marka/components/ui/button";
import { Card, CardContent } from "@marka/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@marka/components/ui/form";
import { Input } from "@marka/components/ui/input";
import { Checkbox } from "@marka/components/ui/checkbox";
import { useToast } from "@marka/hooks/use-toast";
import { login } from "@marka/lib/api";
import { useAuth } from "@marka/hooks/use-auth";
import { User } from "@marka/stores/auth-store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login: LoginUser, isAuthenticated } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      LoginUser(data.accessToken, data.user);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    onError: (error: unknown) => {
      let message = "Please check your credentials and try again.";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in to your account.",
      });
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation, toast]);

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="mb-6 p-0 h-auto text-muted-foreground hover:text-foreground"
                data-testid="back-to-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Marka</span>
            </div>

            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your school's dashboard
            </p>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-none p-0">
            <CardContent className="p-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            data-testid="email-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              data-testid="password-input"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              data-testid="toggle-password-visibility"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="remember-checkbox"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-muted-foreground">
                              Remember me
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button
                      variant="link"
                      className="px-0 text-sm text-primary hover:text-primary/80"
                      data-testid="forgot-password-link"
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                    data-testid="login-submit"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <div className="loading-spinner w-4 h-4 mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                    </span>
                    <Link href="/register">
                      <Button
                        variant="link"
                        className="px-0 text-sm font-medium text-primary hover:text-primary/80"
                        data-testid="register-link"
                      >
                        Register here
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000"
          alt="Ugandan students in modern classroom"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
    </div>
  );
}
