import { LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const logoutUser = async () => {
    await authService.logout();
    logout();
    await queryClient.removeQueries({ queryKey: ["auth"] });

    return navigate("/auth");
  };

  return (
    <div className="p-4 border-gray-200 flex items-center space-x-3">
      <img
        // src="https://avatar.iran.liara.run/public"
        src="https://api.dicebear.com/9.x/adventurer/svg?seed=John"
        alt="User"
        className="size-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate text-sm">
          {user?.username} ({user?.connectCode})
        </h2>
        <p className="text-xm text-gray-500">Online</p>
      </div>
      <button
        onClick={() => logoutUser()}
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        <LogOut className="size-[16px]" />
      </button>
    </div>
  );
};

export default UserProfile;
