"use client";
import {
  useEffect,
  useState
} from "react";
import {
  toast
} from "sonner";
import {
  useForm
} from "react-hook-form";
import {
  zodResolver
} from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  cn
} from "@/lib/utils";
import {
  Button
} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Input
} from "@/components/ui/input";
import {
  Textarea
} from "@/components/ui/textarea";
import TagsSelector from "@/components/form/TagsSelector";
import ImageUploadDropzone from "@/components/form/ImageUploadDropzone";
import { updatePost, fetchPostById, fetchTags } from "@/services/postService";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  title_input: z.string().nonempty("Title is required"),
  content_textarea: z.string(),
  tags_menu: z.array(z.string()).nonempty("Please select at least one tag"),
  image_input: z.string().optional(),
});

export default function UpdatePostForm({ postId }: { postId: string }) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [postImageUrl, setPostImageUrl] = useState<string>();
  //const searchParams = useSearchParams(); 
  //const postId = searchParams.get("postId");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_input: "",
      content_textarea: "",
      tags_menu: [],
      image_input: "",
    },
  });

  const handleImageUrlChange = (url: string) => {
    form.setValue("image_input", url);
  };

  const handleTagChange = (newSelectedTags: string[]) => {
    setSelectedTags(newSelectedTags);
    form.setValue("tags_menu", newSelectedTags);
  };

  // Fetch post data and set as default values
  useEffect(() => {
    if (!postId) return;

    async function fetchPostData() {
      try {
        setLoading(true);
        const post = await fetchPostById(Number(postId));
        if (post.image) {
          setPostImageUrl(`data:image/jpeg;base64,${post.image}`);
        } else {
          setPostImageUrl("");
        }
        form.reset({
          title_input: post.title,
          content_textarea: post.content,
          tags_menu: post.tags.map((tag: any) => tag.name), 
          image_input: postImageUrl,
        });
        setSelectedTags(post.tags.map((tag: any) => tag.name));
      } catch (error) {
        console.error("Failed to load post:", error);
        toast.error("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    }
    
      async function loadTags() {
        try {
          const tagsDto = await fetchTags({ pageNumber: 0, pageSize: 100 });
          setAvailableTags(tagsDto.items.map((tag) => tag.name));
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      }
      loadTags();

    fetchPostData();
  }, [postId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!postId) {
      toast.error("Post ID is missing.");
      return;
    }
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

    const updatedPost = {
      title: values.title_input,
      content: values.content_textarea,
      tags: values.tags_menu,
      image: base64ImageString
    };

    try {
      const result = await updatePost(updatedPost, Number(postId));
      //toast.success("Post updated successfully!");
      router.push("/my-posts"); // Redirect after successful update
      console.log(result);
    } catch (error) {
      console.error("Error updating post:", error);
      //toast.error("Failed to update post. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-3xl mx-auto p-8 bg-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Update Post</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <FormField
                control={form.control}
                name="title_input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" type="text" {...field} />
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
                    <FormLabel>Tags</FormLabel>
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
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUploadDropzone
                        files={files}
                        setFiles={setFiles}
                        onFileUrlChange={handleImageUrlChange}
                        preloadedImageUrl={postImageUrl}
                      />
                    </FormControl>
                    <FormDescription>Update or upload a new image.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Update Post</Button>
            </>
          )}
        </Card>
      </form>
    </Form>
  );
}
