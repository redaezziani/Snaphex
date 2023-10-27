import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/ui/shared/Loader"
import { useCreateAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"

const SignupForm = () => {
  const { toast } = useToast()
  const {mutateAsync:createUserAccount, isLoading:isCreatingUser}= useCreateAccount();
  const { mutateAsync: signInAccount , isLoading: isSigningIn } = useSignInAccount();
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser= await createUserAccount(values)
    if (!newUser) {
      return toast({
        title: " Signup failed, please try again.",
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({
        title: "Signin failed, please try again.",
      })
    }
    //1:40:57


  }
  return (
      <Form {...form}>
        <div
        className="sm:w-[340px] flex-center flex-col"
        >
          <img
          src="/assets/images/logo.svg"
          alt="logo"
          className=" hue-rotate-[100deg]"
          />
          <h2
          className=" font-bold text-start text-[1.35rem] mt-2"
          >
            Create a new account
          </h2>
          <p
          className=" text-red/80 text-xs small-medium "
          >
            To use Snaphex Please  enter your details.
          </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Username
              </FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
              </FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
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
              <FormLabel>
                Password
              </FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
        className="shad-button_primary"
        type="submit">
          {
            isCreatingUser ? (
              <div
              className="flex-center gap-2 "
              >
                <Loader />
                Loading ...
              </div>
            ) : (
              <div
              className="flex-center gap-2 "
              >
                Sign up
              </div>
            )

          }
        </Button>
        <p
        className="text-center mt-2 text-sm text-red/80 small-medium"
        >
          Already have an account? <Link to="/sign-in" className=" text-white">Sign in</Link>
        </p>
      </form>
      </div>

    </Form>
  )
  
}

export default SignupForm