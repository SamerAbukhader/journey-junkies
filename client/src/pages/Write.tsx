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
import { useEffect, useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Form } from "react-router-dom";
import { IconUpload } from "@tabler/icons-react";
import { useAuth } from "@clerk/clerk-react";
import { convertToBase64 } from "../utils";
import { locations } from "../types/data";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import e from "express";
import { MarkerF } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";

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

const Write = () => {
  const { classes } = useStyles();
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string>();
  const { userId } = useAuth();
  const [markerPosition, setMarkerPosition] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      console.log(autocomplete.getPlace());
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (location) {
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
      } else {
        // Handle the case where place.geometry or place.geometry.location is undefined
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMarkerPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      // Browser doesn't support Geolocation
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

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
      <Title className={classes.title} mb="lg" id="blog-post-title">
        Show your{" "}
        <Text component="span" inherit className={classes.highlight}>
          creativity
        </Text>
      </Title>
      <Form method="post" action="/write" aria-labelledby="blog-post-title">
        <TextInput
          placeholder="your amazing blog title"
          label="Title"
          name="title"
          withAsterisk
          required
          mb={rem(16)}
          aria-label="Enter your blog title"
        />
        <TextInput
          placeholder="add a short description"
          label="Description"
          name="description"
          withAsterisk
          required
          mb={rem(16)}
          aria-label="Enter a short description"
        />
        <TextInput
          placeholder="add a post tag"
          label="Tag"
          name="tag"
          withAsterisk
          required
          mb={rem(16)}
          aria-label="Add a post tag"
        />
        <Select
          label="location"
          placeholder="Post location"
          data={locations}
          mb={rem(16)}
          required
          name="location"
          aria-label="Select post location"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          <div
            style={{ width: "100%", maxWidth: "600px", marginBottom: "10px" }}
          >
            <Autocomplete
              onLoad={(autocomplete) => setAutocomplete(autocomplete)}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Search location"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </Autocomplete>
          </div>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            zoom={10}
            center={markerPosition}
            onClick={(e) => {
              setMarkerPosition({
                lat: e.latLng?.lat() || 0,
                lng: e.latLng?.lng() || 0,
              });
            }}
          >
            {markerPosition && <MarkerF position={markerPosition} />}
          </GoogleMap>
        </div>

        <FileInput
          label="Banner Image"
          placeholder="Select image"
          withAsterisk
          icon={<IconUpload size={rem(14)} />}
          mb={rem(16)}
          required
          onChange={async (payload: File | null) => {
            if (payload !== null) {
              setImage(await convertToBase64(payload));
            } else {
              setImage("");
            }
          }}
          clearable
          accept="image/*"
          aria-label="Upload banner image"
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
        <Input
          readOnly
          value={JSON.stringify(markerPosition)}
          name="map_coords"
          display="none"
          required
        />
        <Input.Label htmlFor="rich-text-editor">Content</Input.Label>
        <RichTextEditor
          editor={editor}
          id="rich-text-editor"
          aria-label="Edit post content"
        >
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
        <Button
          type="submit"
          fullWidth
          mt="lg"
          style={{ marginBottom: "100px" }}
        >
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default Write;
