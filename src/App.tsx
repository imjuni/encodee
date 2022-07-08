import { MantineProvider } from '@mantine/core';
import log from 'loglevel';
import Polyglot from 'node-polyglot';
import 'normalize.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import korean from './i18n/korean.json';
import Base64 from './page/Base64';
import Guid from './page/Guid';
import NotFound from './page/NotFound';

export default function App() {
  const [polyglot] = useState(new Polyglot({ phrases: korean }));
  useEffect(() => {
    log.setDefaultLevel(log.levels.DEBUG);
  }, []);

  return (
    <MantineProvider
      theme={{
        fontFamily: 'Verdana, sans-serif',
        fontFamilyMonospace: 'Monaco, Courier, monospace',
        headings: { fontFamily: 'Greycliff CF, sans-serif' },
      }}
    >
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Base64 t={polyglot.t} />} />
          <Route path="/guid" element={<Guid t={polyglot.t} />} />

          <Route path="*" element={<NotFound t={polyglot.t} />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
