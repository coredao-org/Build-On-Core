import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import FaPlus from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { FaPlus } from "react-icons/fa";

const Faqs = () => {
  return (
    <div className='mt-10'>
      <Accordion>
        <AccordionSummary
        sx={{ backgroundColor: '#2a2a2a', color: '#E0BB83', border: '1px solid #E0BB83', fontWeight: '500' }}
          expandIcon={<FaPlus className='text-[#E0BB83]' />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          What is PeerLend?
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#e0bb83aa' }}>
        PeerLend is a peer-to-peer (P2P) lending platform that connects borrowers and lenders directly, enabling secure and efficient loans without traditional banks.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
        sx={{ backgroundColor: '#2a2a2a', color: '#E0BB83', border: '1px solid #E0BB83', fontWeight: '500' }}
          expandIcon={<FaPlus className='text-[#E0BB83]'  />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
           How do I apply for a loan on PeerLend?
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#e0bb83aa' }}>
        To apply for a loan, simply sign up, verify your email, and add your collateral. Afterwards you can create a request according to your needs.</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
        sx={{ backgroundColor: '#2a2a2a', color: '#E0BB83', border: '1px solid #E0BB83', fontWeight: '500' }}
          expandIcon={<FaPlus className='text-[#E0BB83]'  />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
           How does collateral work on PeerLend?
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#e0bb83aa' }}>
        Collateral is a security measure where you pledge a part of your funds or assets to secure your loan. It helps reduce risk for lenders and can improve your loan terms.</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
        sx={{ backgroundColor: '#2a2a2a', color: '#E0BB83', border: '1px solid #E0BB83', fontWeight: '500' }}
          expandIcon={<FaPlus className='text-[#E0BB83]'  />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
            Is PeerLend safe to use?
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#e0bb83aa' }}>
        Yes, PeerLend employs robust security measures, including encryption and multi-factor authentication, to protect user data and funds.</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
        sx={{ backgroundColor: '#2a2a2a', color: '#E0BB83', border: '1px solid #E0BB83', fontWeight: '500' }}
          expandIcon={<FaPlus className='text-[#E0BB83]'  />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
           Can I invest in loans on PeerLend?
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#e0bb83aa' }}>
        Absolutely! As a lender, you can browse loan requests, choose the ones that match your criteria, and invest to earn interest on your funds.</AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Faqs;