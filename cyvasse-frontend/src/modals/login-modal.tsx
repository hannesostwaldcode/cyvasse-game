import { useModal } from "../hooks/useModal"
import { useForm } from "react-hook-form"
import useToken from "../hooks/useToken"
import * as z from "zod"
import api from "../lib/api"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/components/provider/Auth-Provider"

const formSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1)
})

export const LoginModal = () => {
    const {isOpen, onClose, type} = useModal()
    const {setToken} = useToken()
    const isModalOpen = isOpen && type === "logIn";
    const {onLogin} = useAuth()
    


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        onLogin(data)
        form.reset()
        onClose()
    
    
        
    }
    const isLoading = form.formState.isLoading;
    const handelClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handelClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Log In
                    </DialogTitle>
                </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 px-6">
                    <div className="flex items-center justify-center text-center">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                        <FormLabel>
                                            E-Mail
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                
                                                placeholder="Enter email here"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                                <FormLabel>
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isLoading}
                                                        type="password"
                                                        placeholder="Enter password here"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                    )}
                                />
                    </div>
                </div>
                
                <DialogFooter>
                                <Button variant={"default"} disabled={isLoading}>
                                        Save
                                </Button>
                            </DialogFooter>
                            </form>
                            </Form>
            </DialogContent>
        </Dialog>
    )
}