"use client"
import {
  useEffect,
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Textarea
} from "@/components/ui/textarea"
import TagsSelector from "@/components/form/TagsSelector"
import ImageUploadDropzone from "@/components/form/ImageUploadDropzone"
import { addPost, fetchTags } from "@/services/postService"
;
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card"
import { register, enableUser, getRandomPassword, login, logout, requestPasswordReset, resetPassword, getUser, changePassword, addTagsToUser, modifyUser} from "@/services/authenticationService"


const formSchema = z.object({
  title_input: z.string().nonempty("Title is required"),
  content_textarea: z.string(),
  tags_menu: z.array(z.string()).nonempty("Please at least one item"),
  image_input: z.string().optional()
});



export default function AddPostForm() {
  const [files, setFiles] = useState < File[] | null > (null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const router = useRouter(); 
  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_input: "",         
      content_textarea: "",    
      tags_menu: [],          
      image_input: "",         
    },
  })

  const handleImageUrlChange = (url: string) => {
    form.setValue("image_input", url);
  };

  const handleTagChange = (newSelectedTags: string[]) => {
    setSelectedTags(newSelectedTags);
    form.setValue("tags_menu", newSelectedTags); 
  };

  useEffect(() => {
    async function loadTags() {
      try {
        const tagsDto = await fetchTags({ pageNumber: 0, pageSize: 100 });
        setAvailableTags(tagsDto.items.map((tag) => tag.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    loadTags();
  }, []);


  async function onSubmit(values: z.infer < typeof formSchema > ) {
    console.log(files);

    let base64ImageString: string | undefined;
  if (files?.length) {
    const file = files[0];
    const fileReader = new FileReader();

    // Convert the file to a Base64 string
    const fullBase64ImageString = await new Promise<string>((resolve, reject) => {
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = () => reject(new Error("Failed to read file"));
      fileReader.readAsDataURL(file); // Converts to Base64
    });
    
    base64ImageString = fullBase64ImageString.split(",")[1];
  }
    const post = {
      title: values.title_input,
      content: values.content_textarea,
      tags: values.tags_menu,
      image: base64ImageString
    };
    
   try {
    const result = await addPost(post);
    router.push("/posts");
    console.log(result);
   } catch (error) {
    console.error("Error adding post:", error);
   // toast.error("Failed to add post. Please try again.");
   }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <Card className="max-w-3xl mx-auto p-8 bg-white rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Create Post</h1>
        <FormField
          control={form.control}
          name="title_input"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                placeholder=""
                type=""
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content_textarea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
           <FormField
              control={form.control}
              name="tags_menu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select your tags</FormLabel>
                  <FormControl>
                  <TagsSelector
                    selectedTags={selectedTags} 
                    setSelectedTags={handleTagChange} 
                    availableTags={availableTags}
                  />
                  </FormControl>
                  <FormDescription>Select up to 5 tags.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        
        <FormField
          control={form.control}
          name="image_input"
          render={() => (
            <FormItem>
              <FormLabel>Select Image</FormLabel>
              <FormControl>
                <ImageUploadDropzone files={files} setFiles={setFiles} onFileUrlChange={handleImageUrlChange}/>
              </FormControl>
              <FormDescription>Select a file to upload.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        </Card>
      </form>
    </Form>
  )
}