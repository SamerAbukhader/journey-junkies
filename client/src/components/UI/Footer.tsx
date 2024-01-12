import { Container, Group, ActionIcon, rem } from '@mantine/core';
import classes from './FooterSocial.module.css';
import { IconBrandGithub } from '@tabler/icons-react';

export function Footer() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <h1>Journey Junkies</h1>
        <p style={{fontSize:"10px"}}>Copyright @ 2024 Journey Junkies | Powered by Journey Junkies</p>
        <a href={"https://github.com/SamerAbukhader/journey-junkies"} target="_blank" rel="noopener noreferrer">
        <Group spacing={0} className={classes.links} align="flex-end" style={{ flexWrap: 'nowrap' }}>
          
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandGithub style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
          </ActionIcon>
        </Group>
        </a>
      </Container>
    </div>
  );
}

