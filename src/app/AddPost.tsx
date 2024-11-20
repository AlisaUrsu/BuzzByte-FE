"use client"
import {
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
import { addPost } from "@/services/postService"
;
const formSchema = z.object({
  title_input: z.string().nonempty("Title is required"),
  content_textarea: z.string(),
  tags_menu: z.array(z.string()).nonempty("Please at least one item"),
  image_input: z.string().optional()
});



export default function MyForm() {
  const [files, setFiles] = useState < File[] | null > (null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
  })

  const handleImageUrlChange = (url: string) => {
    form.setValue("image_input", url);
  };

  const handleTagChange = (newSelectedTags: string[]) => {
    setSelectedTags(newSelectedTags); // Update internal state
    form.setValue("tags_menu", newSelectedTags); // Sync with react-hook-form
  };

  async function onSubmit(values: z.infer < typeof formSchema > ) {
    console.log(files);
    const post = {
      title: values.title_input,
      description: "", // Set description to an empty string as required
      content: values.content_textarea,
      tags: values.tags_menu,
      image: files?.length ? URL.createObjectURL(files[0]) : undefined,
    };
    /*try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }*/
   try {
    const result = await addPost(post);
    toast.success("Post added succesfully");
    console.log(result);
   } catch (error) {
    console.error("Error adding post:", error);
    toast.error("Failed to add post. Please try again.");
   }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        
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
                  className="resize-none"
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
                    selectedTags={selectedTags} // Pass selectedCategories
                    setSelectedTags={handleTagChange} // Pass setSelectedCategories
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
      </form>
    </Form>
  )
}