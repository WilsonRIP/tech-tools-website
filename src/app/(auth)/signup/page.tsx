"use client";

import { FC, useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { fadeInUp, staggerContainer } from '../../../lib/animations';

const SignupPage: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Signing up:', { email, password });
      // TODO: Replace with real signup API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Signup failed—please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, confirmPassword, router]);

  return (
    <>
      <Head>
        <title>Sign Up | Your App</title>
        <meta name="description" content="Create a new account." />
      </Head>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />

        <main className="flex flex-1 flex-col items-center justify-center px-4 pt-32 pb-12">
          <motion.div
            variants={staggerContainer(0.2)}
            initial="initial"
            animate="animate"
            className="w-full max-w-md"
          >
            <motion.div variants={fadeInUp} className="rounded-xl border border-border bg-card p-8 shadow-lg">
              <h1 className="mb-8 text-center text-3xl font-bold">Create your account</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    placeholder="you@example.com"
                    className="mt-1"
                    aria-describedby="email-error"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className="mt-1"
                    aria-describedby="password-error"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmChange}
                    required
                    placeholder="••••••••"
                    className="mt-1"
                    aria-describedby="confirm-password-error"
                  />
                </div>

                {error && (
                  <motion.div variants={fadeInUp} role="alert" className="text-sm text-destructive">
                    {error}
                  </motion.div>
                )}

                <motion.div variants={fadeInUp}>
                  <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span className="ml-2">Creating account...</span>
                      </span>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.p variants={fadeInUp} className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium hover:underline">
                  Log in
                </Link>
              </motion.p>
            </motion.div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SignupPage;
