import { ArrowRight, Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { useState, type ChangeEvent, type SubmitEvent } from "react";

function RegistrationPage() {
  // controlled component state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registered user:", {
      username,
      email,
      password,
      agreeToTerms,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#0F1117] border border-[#222834] rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            ThermalPaste
          </h1>
          <p className="text-[#8F99A8] text-sm">
            Create a new account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-2"
            >
              Username
            </label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 text-[#8F99A8] absolute left-3.5 pointer-events-none" />
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                placeholder="Choose a username"
                className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8] pl-11 pr-4 py-3 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-2"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-[#8F99A8] absolute left-3.5 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email address"
                className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8] pl-11 pr-4 py-3 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-2"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-[#8F99A8] absolute left-3.5 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8] pl-11 pr-11 py-3 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 text-[#8F99A8] hover:text-white transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-2"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-[#8F99A8] absolute left-3.5 pointer-events-none" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8] pl-11 pr-11 py-3 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 text-[#8F99A8] hover:text-white transition cursor-pointer"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-center select-none">
            <input
              id="agreeToTerms"
              type="checkbox"
              required
              checked={agreeToTerms}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAgreeToTerms(e.target.checked)
              }
              className="w-4 h-4 rounded bg-[#161922] border-[#222834] text-[#00D8F6] focus:ring-0 focus:ring-offset-0 accent-[#00D8F6] cursor-pointer"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 text-sm text-[#8F99A8] cursor-pointer select-none"
            >
              I agree to the{" "}
              {/* need to switch with NavLink later */}
              <a href="#" className="text-[#00D8F6] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#00D8F6] hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] font-bold text-sm uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(0,216,246,0.25)] active:scale-[0.98] cursor-pointer"
          >
            <span>Create Account</span>
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Login page routing */}
        <div className="mt-8 text-center border-t border-[#222834] pt-6">
          <p className="text-sm text-[#8F99A8]">
            Already have an account? 
            {/* will update to NavLink */}
            <a
              href="#"
              className="text-[#00D8F6] font-semibold hover:underline inline-flex items-center gap-1 transition-all ml-1"
            >
              Sign in <ArrowRight className="w-3.5 h-3.5 inline" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
