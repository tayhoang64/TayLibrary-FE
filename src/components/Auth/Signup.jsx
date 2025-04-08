import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../../constants";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
    };

    const validatePassword = (password) => {
        return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }
        if (!validatePassword(password)) {
            setError(
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
            );
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/user/register`, {
                username,
                email,
                password,
                confirmPassword,
            });
            if (response.status === 200) {
                console.log("Signup successful:", response.data);
                navigate("/login"); 
            }
        } catch (err) {
            console.log(err);
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Column - Login Form */}
            <div className="flex w-full flex-col p-8 md:w-1/2 md:p-12 lg:p-16">
                <div className="mb-8">
                    <div className="h-14 w-14 rounded-lg bg-emerald-800 p-3">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-full w-full text-white"
                        >
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="mb-10">
                    <h1 className="mb-2 text-2xl font-bold">Sign up</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <p className="text-gray-500">Welcome to BookShop</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="aloooooo"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="hi@filianta.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Confirm Password
                            </label>
                        </div>
                        <input
                            id="cfpassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-emerald-800 py-2 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
                    >
                        {/* <Link to="/login"></Link> */}
                        Sign Up

                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    Already have an account? {" "}
                    <Link to="/login" className="font-medium text-emerald-800">
                        Login
                    </Link>
                </div>
            </div>

            {/* Right Column - Promotional Content */}
            <div className="hidden bg-emerald-800 md:flex md:w-1/2">
                <div className="relative flex w-full flex-col items-center justify-center p-12">
                    <div className="mb-12 max-w-md text-center">
                        <h2 className="mb-4 text-4xl font-light italic text-white lg:text-5xl">
                            Enter
                            <br />
                            the Future
                            <br />
                            <span className="mt-2 block">of Payments,</span>
                            <span className="block">today</span>
                        </h2>
                    </div>

                    {/* App Preview Card */}
                    <div className="relative w-full max-w-sm">
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <div className="mb-6 flex justify-center">
                                <div className="h-8 w-8 rounded-full bg-gray-100 p-1">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-full w-full text-emerald-800 opacity-30"
                                    >
                                        <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15 9L9 15"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9 9L15 15"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-2xl font-bold">12,347.23 $</div>
                                <div className="text-sm text-gray-500">Combined balance</div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Primary Card</div>
                                        <div className="text-sm text-gray-500">3495 **** **** 6917</div>
                                    </div>
                                    <div className="text-right font-bold">2,546.64$</div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-gray-400">VISA</div>
                                    <button className="rounded-full bg-gray-100 px-4 py-1 text-xs">View All</button>
                                </div>
                            </div>
                        </div>

                        {/* App Navigation */}
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 transform">
                            <div className="flex flex-col items-center space-y-4 rounded-full bg-white p-3 shadow-md">
                                <div className="rounded-full bg-emerald-800 p-2 text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <div className="p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-400"
                                    >
                                        <rect width="7" height="7" x="3" y="3" rx="1" />
                                        <rect width="7" height="7" x="14" y="3" rx="1" />
                                        <rect width="7" height="7" x="14" y="14" rx="1" />
                                        <rect width="7" height="7" x="3" y="14" rx="1" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Logo */}
                    <div className="absolute bottom-8 right-8">
                        <div className="h-12 w-12 rounded-full bg-white p-3">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-full w-full text-emerald-800"
                            >
                                <path
                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15 9L9 15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9 9L15 15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup

