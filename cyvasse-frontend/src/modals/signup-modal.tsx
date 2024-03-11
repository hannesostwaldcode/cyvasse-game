import { useModal } from "../hooks/useModal"
import { useForm } from "react-hook-form"
import useToken from "../hooks/useToken"
import api from "../lib/api"
import * as z from "zod"
import {CountrySelector} from "@/components/countrySelector"
import { Dialog,DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
    name: z.string().min(1),
    country: z.string()
})

export const SignupModal = () => {
    const {isOpen, onClose, type} = useModal()
    const {setToken} = useToken()
    const isModalOpen = isOpen && type === "signUp";

    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            country: ""
        }
    })

    
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        api.postForm("/signup", data)
        .then((res) => {
            setToken(res.data.access_token)
            form.reset()
            onClose()
        })
        .catch((error) => {console.log(error)})
        
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
                        Sign Up
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
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                                <FormLabel>
                                                    Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isLoading}
                                                        placeholder="Enter name here"
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
                    <div className="flex items-center justify-center text-center">
                    
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({}) => (
                                        <FormItem className="flex flex-col">
                                                <FormLabel>
                                                    Country
                                                </FormLabel>
                                                <FormControl>
                                                    
                                                <CountrySelector onSelect={(e) => form.setValue("country", e)}/>
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