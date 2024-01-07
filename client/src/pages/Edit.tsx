import {
  Container,
  Text,
  createStyles,
  Title,
  rem,
  Button,
  TextInput,
  FileInput,
  Input,
  Select,
} from "@mantine/core";
import { useEditor } from "@tiptap/react";
import { useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Form, LoaderFunction, useLoaderData } from "react-router-dom";
import { IconUpload } from "@tabler/icons-react";
import { useAuth } from "@clerk/clerk-react";
import { convertFromBase64, convertToBase64 } from "../utils";
import { locations } from "../types/data";
import { LoaderData } from "../types";
import { editPostLoader } from "../loaders";

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },
}));

export const EditPostPage = () => {
  // Load post data using the editPostLoader
  const post = useLoaderData() as LoaderData<typeof editPostLoader>;
  // Extract classes from Mantine styles
  const { classes } = useStyles();
  // State for managing content and image values
  const [content, setContent] = useState<string>(post.content);
  const [image, setImage] = useState<string>(post.image);
  // Authentication hook from Clerk
  const { userId } = useAuth();

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate({ editor }) {
      // Update content state on editor changes
      setContent(editor.getHTML());
    },
  });

  return (
    <Container>
      {/* Post title */}
      <Title className={classes.title} mb="lg" id="edit-post-title">
        <Text component="span" inherit className={classes.highlight}>
          Edit{" "}
        </Text>
        {post.title}
      </Title>
      {/* Post edit form */}
      <Form method="post" action="/write" aria-labelledby="edit-post-title">
        {/* Title input */}
        <TextInput
          placeholder="your amazing blog title"
          label="Title"
          name="title"
          withAsterisk
          required
          value={post.title}
          mb={rem(16)}
          aria-label="Enter your blog title"
        />
        {/* Description input */}
        <TextInput
          placeholder="add a short description"
          label="Description"
          name="description"
          withAsterisk
          required
          value={post.description}
          mb={rem(16)}
          aria-label="Enter a short description"
        />
        {/* Tag input */}
        <TextInput
          placeholder="add a post tag"
          label="Tag"
          name="tag"
          withAsterisk
          required
          value={post.tag}
          mb={rem(16)}
          aria-label="Add a post tag"
        />
        {/* Location dropdown */}
        <Select
          label="Location"
          placeholder="Post location"
          data={locations}
          mb={rem(16)}
          required
          value={post.location}
          name="location"
          aria-label="Select post location"
        />
        {/* Banner Image input */}
        <FileInput
          label="Banner Image"
          placeholder="Select image"
          withAsterisk
          icon={<IconUpload size={rem(14)} />}
          mb={rem(16)}
          required
          aria-label="Upload banner image"
          clearable
          accept="image/*"
        />
        {/* Hidden inputs for form data */}
        <Input
          readOnly
          value={content}
          name="content"
          display="none"
          required
          aria-hidden="true"
        />
        <Input readOnly value={image} name="image" display="none" required aria-hidden="true" />
        <Input
          readOnly
          value={String(userId)}
          name="author"
          display="none"
          required
          aria-hidden="true"
        />
        {/* Label for rich text editor */}
        <Input.Label htmlFor="rich-text-editor">Content</Input.Label>
        {/* Rich text editor with toolbar and content */}
        <RichTextEditor editor={editor} id="rich-text-editor" aria-label="Edit post content">
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            {/* Toolbar controls for text formatting */}
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>
            {/* Toolbar controls for headings */}
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>
            {/* Toolbar controls for block elements */}
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>
            {/* Toolbar controls for links */}
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
            {/* Toolbar controls for text alignment */}
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          {/* Content area of the rich text editor */}
          <RichTextEditor.Content />
        </RichTextEditor>
        {/* Submit button */}
        <Button type="submit" fullWidth mt="lg">
          Save
        </Button>
      </Form>
    </Container>
  );
};
