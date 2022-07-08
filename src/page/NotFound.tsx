import { Anchor, AppShell, Container, Space, Title } from '@mantine/core';
import Polyglot from 'node-polyglot';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../component/NavHeader';

const Guid: React.FC<{ t: Polyglot['t'] }> = () => {
  const navigate = useNavigate();
  return (
    <AppShell
      padding="md"
      header={<NavHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <Container>
        <Title order={1}>Not Found</Title>

        <Space h="md" />

        <Anchor onClick={() => navigate('/')}>Go to Home</Anchor>
      </Container>
      {/* Your application here */}
    </AppShell>
  );
};

export default Guid;
