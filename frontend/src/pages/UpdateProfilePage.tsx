import UserProfileForm, { type UserProfileFormDataType } from "@/components/forms/UserProfileForm"
import { useAuthContext } from "@/context/AuthContext"
import type { SafeUserType } from "@/types/user"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const UpdateProfilePage = () => {
    const { user, setUserInfo } = useAuthContext()

    const { mutate: updateUserProfile, isPending } = useMutation<SafeUserType, AxiosError<{ message: string }>, UserProfileFormDataType>({
        mutationFn: async (profileFormData) => {
            const response = await axios.put("/api/users/profile", profileFormData)
            return response.data
        },
        onSuccess: (data) => {
            setUserInfo(data)
            toast.success("Profile updated successfully")
        },
        onError: (error) => {
            toast.error(error?.response?.data.message || "Failed to update the profile")
        }
    })

    const handleUpdateUserProfile = (updateProfileFormData: UserProfileFormDataType) => {
        updateUserProfile(updateProfileFormData)
    }

    return (
        <div className="h-[calc(100vh-160px)] flex justify-center items-center">
            <div className="max-w-md w-full bg-card p-4 rounded-lg">
                <h1 className="mb-4 text-lg font-semibold text-center">Update Profile</h1>

                <UserProfileForm 
                    onSubmit={handleUpdateUserProfile}
                    isPending={isPending}
                    user={user}
                />
            </div>
        </div>
    )
}
export default UpdateProfilePage