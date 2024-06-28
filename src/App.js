import './App.css';
import Candidates from './pages/Candidates';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import * as React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import ShortListedCandidates from './pages/ShortListecCandidates';


function App() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className="App">
      <h1> Candidates Management System</h1>
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value} centered>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered>
        <Tab label="All Candidates" value="1" />
            <Tab label="Shortlisted Candidates" value="2" />
      </Tabs>
        </Box>
        <TabPanel value="1"><Candidates /></TabPanel>
        <TabPanel value="2"><ShortListedCandidates /></TabPanel>
      </TabContext>
    </Box>
      {/* <Candidates /> */}
      {/* <Button variant="contained">Hello world</Button> */}
    </div>
  );
}

export default App;
