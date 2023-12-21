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

const EditPost = () => {
  const post = useLoaderData() as LoaderData<typeof editPostLoader>;
  const { classes } = useStyles();
  const [title, setTitle] = useState<string>(post.title);
  const [description, setDescription] = useState<string>(post.description);
  const [tag, setTag] = useState<string>(post.tag);
  const [location, setLocation] = useState<string>(post.location);
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
          Edit{" "}
        </Text>
        {post.title}
      </Title>
      <Form method="post">
        <TextInput
          placeholder="your amazing blog title"
          label="Title"
          name="title"
          withAsterisk
          required
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          mb={rem(16)}
          aria-label="Enter your blog title"
        />
        <TextInput
          placeholder="add a short description"
          label="Description"
          name="description"
          withAsterisk
          required
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          mb={rem(16)}
          aria-label="Enter a short description"
        />
        <TextInput
          placeholder="add a post tag"
          label="Tag"
          name="tag"
          withAsterisk
          required
          value={tag}
          onChange={(event) => setTag(event.currentTarget.value)}
          mb={rem(16)}
          aria-label="Add a post tag"
        />
        <Select
          label="location"
          placeholder="Post location"
          data={locations}
          mb={rem(16)}
          required
          value={location}
          onChange={(event: string) => setLocation(event)}
          name="location"
          aria-label="Select post location"
        />
        <FileInput
          label="Banner Image"
          placeholder="Select image"
          withAsterisk
          icon={<IconUpload size={rem(14)} />}
          mb={rem(16)}
          required
          aria-label="Upload banner image"
          onChange={async (payload: File | null) => {
            if (payload !== null) {
              setImage(await convertToBase64(payload));
            }
          }}
          value={convertFromBase64(post.image, `${post.title} image`)}
          clearable
          accept="image/*"
        />
        {image && <img src={image} alt="banner" width="100%" />}
        <Input
          readOnly
          value={content}
          name="content"
          display="none"
          required
          aria-hidden="true"
        />
        <Input readOnly value={image} name="image" display="none" required />
        <Input
          readOnly
          value={String(userId)}
          name="author"
          display="none"
          required
          aria-hidden="true"
        />
        <Input.Label>Content</Input.Label>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
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

export default EditPost;
