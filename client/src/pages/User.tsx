import {
  Avatar,
  Center,
  Container,
  Flex,
  Group,
  Paper,
  Text,
  Tabs,
} from "@mantine/core";
import { useUser } from "@clerk/clerk-react";

import Chart from "../components/UI/Chart";
import {
  IconChartBar,
  IconInfoCircle,
  IconDiscountCheckFilled,
} from "@tabler/icons-react";
import { filterRates, formatDate, timeAgo } from "../utils";
import { useLoaderData } from "react-router-dom";
import { Post } from "../components/UI";
import { LoaderData, Post as PostType } from "../types";
import { profilePageLoader } from "../loaders";

const User = () => {
  const { user } = useUser();
  const data = useLoaderData() as any;
  const ratingsChart = filterRates(data?.ratings || []);
  return (
    <Container size={1200}>
      <Paper p="lg" my="lg">
        <Flex justify={"center"}>
          <Group>
            <Avatar
              size={150}
              src={user?.profileImageUrl}
              radius={150}
              alt={`Profile image of ${user?.fullName}`}
            />
            <Text size={30} ml={50} mr={-10} weight={"bold"}>
              {user?.fullName}
            </Text>
            <>
              {user?.unsafeMetadata!["verified"] && (
                <IconDiscountCheckFilled size={30} aria-label="Verified User" />
              )}
            </>
          </Group>
        </Flex>
      </Paper>
      <Paper mt={10} p="lg" my="lg">
        <Text weight={"bold"} size={"xl"} align="center" mb={20}>
          Statistics & Information
        </Text>
        <Tabs defaultValue="Statistics" aria-label="User Profile Tabs">
          <Tabs.List position="center" grow={true}>
            <Tabs.Tab value="Statistics" icon={<IconChartBar size="1.3rem" />}>
              <Text weight={"bold"} size={"md"} align="center">
                Statisics
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="posts" icon={<IconChartBar size="1.3rem" />}>
              <Text weight={"bold"} size={"md"} align="center">
                Posts
              </Text>
            </Tabs.Tab>
            <Tabs.Tab
              value="Information"
              icon={<IconInfoCircle size="1.3rem" />}
            >
              <Text weight={"bold"} size={"md"} align="center">
                Information
              </Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Statistics" pt="xs">
            <Center>
              <Chart rates={ratingsChart} />
            </Center>
          </Tabs.Panel>

          <Tabs.Panel value="posts" pt="xs">
            <Center>
              {data?.posts?.length > 0 ? (
                data?.posts?.map((post: PostType) => <Post {...post} />)
              ) : (
                <p>No posts available.</p>
              )}
            </Center>
          </Tabs.Panel>

          <Tabs.Panel value="Information" pt="xs">
            <Flex justify={"center"}>
              <Text size={"xl"} color="dimmed" mb={10}>
                Join Date:
              </Text>
              <Text ml={10} size={"xl"}>
                {formatDate(user?.createdAt)}
              </Text>
            </Flex>
            <Flex justify={"center"}>
              <Text size={"xl"} color="dimmed">
                Last Active:
              </Text>
              <Text ml={10} size={"xl"}>
                {timeAgo(String(user?.lastSignInAt))}
              </Text>
            </Flex>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default User;
