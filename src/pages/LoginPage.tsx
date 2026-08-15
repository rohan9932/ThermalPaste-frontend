import { ArrowRight, Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { NavLink, useNavigate } from "react-router";

function LoginPage() {
  // controlled component
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in with:", { usernameOrEmail, password, rememberMe });
    navigate("/");
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
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / Email Field */}
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-2"
            >
              Username or Email
            </label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 text-[#8F99A8] absolute left-3.5 pointer-events-none" />
              <input
                id="usernameOrEmail"
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsernameOrEmail(e.target.value)
                }
                placeholder="Enter your username or email"
                className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8] pl-11 pr-4 py-3 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8]"
              >
                Password
              </label>
              {/* need to update to api call Later */}
              <a
                href="#"
                className="text-xs text-[#00D8F6] hover:underline transition-all"
              >
                Forgot password?
              </a>
            </div>
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
                placeholder="Enter your password"
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center select-none">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRememberMe(e.target.checked)
              }
              className="w-4 h-4 rounded bg-[#161922] border-[#222834] text-[#00D8F6] focus:ring-0 focus:ring-offset-0 accent-[#00D8F6] cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-sm text-[#8F99A8] cursor-pointer select-none"
            >
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] font-bold text-sm uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(0,216,246,0.25)] active:scale-[0.98] cursor-pointer"
          >
            <span>Sign In</span>
            <LogIn className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Registration page routing */}
        <div className="mt-8 text-center border-t border-[#222834] pt-6">
          <p className="text-sm text-[#8F99A8]">
            Don't have an account? {/* will update to NavLink */}
            <NavLink
              to="/register"
              className="text-[#00D8F6] font-semibold hover:underline inline-flex items-center gap-1 transition-all ml-1"
            >
              Create one <ArrowRight className="w-3.5 h-3.5 inline" />
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
