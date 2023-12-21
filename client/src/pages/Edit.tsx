
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
  const post = useLoaderData() as LoaderData<typeof editPostLoader>;
  const { classes } = useStyles();
  const [content, setContent] = useState<string>(post.content);
  const [image, setImage] = useState<string>(post.image);
  const { userId } = useAuth();

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
      setContent(editor.getHTML());
    },
  });

  return (
    <Container>
      <Title className={classes.title} mb="lg">
        <Text component="span" inherit className={classes.highlight}>
          Edit
        </Text>
        {post.title}
      </Title>
      <Form method="post" action="/write">
        {/* Input fields for title, description, tag, location, and banner image */}
        <TextInput
          placeholder="your amazing blog title"
          label="Title"
          name="title"
          withAsterisk
          required
          value={post.title}
          mb={rem(16)}
        />
        {/* ...other input fields */}

        {/* Hidden inputs for content, image, and author */}
        <Input readOnly value={content} name="content" display="none" required />
        <Input readOnly value={image} name="image" display="none" required />
        <Input
          readOnly
          value={String(userId)}
          name="author"
          display="none"
          required
        />

        <Input.Label>Content</Input.Label>
        <RichTextEditor editor={editor}>
          {/* Rich text editor toolbar */}
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            {/* Editor controls */}
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>

        <Button type="submit" fullWidth mt="lg">
          Save
        </Button>
      </Form>
    </Container>
  );
};
