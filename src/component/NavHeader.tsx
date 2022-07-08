import { Anchor, Grid, Group, Header, Stack, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const NavHeader = () => {
  const navigate = useNavigate();
  return (
    <Header height={60} p="xs">
      <Grid columns={36}>
        <Grid.Col span={6}>
          <Title order={1}>Encodee</Title>
        </Grid.Col>
        <Grid.Col span={30}>
          <Group style={{ height: '100%' }}>
            <Stack justify={'center'}>
              <Anchor
                onClick={(event: any) => {
                  event.preventDefault();
                  navigate('/');
                }}
              >
                Base64
              </Anchor>
            </Stack>
            <Stack justify={'center'}>
              <Anchor
                onClick={(event: any) => {
                  event.preventDefault();
                  navigate('/guid');
                }}
              >
                GUID
              </Anchor>
            </Stack>
          </Group>
        </Grid.Col>
      </Grid>
    </Header>
  );
};

export default NavHeader;
