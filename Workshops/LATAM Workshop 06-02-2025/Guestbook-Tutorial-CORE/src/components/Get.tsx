import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Guestbook from '../contractABI/Guestbook.json';
import {
  ItemBackground,
  ItemContainer,
  ItemHeader,
  ItemTitle,
  ItemBody,
  ItemAddMessageButton,
  Table,
  TableHeader,
  TableCell,
  TableRow
} from "../style/NewPageStyle";

const contractAddress = '0x340A1067B679dEa0ec13663487dF2B6363da0F89';
const abi = Guestbook.abi;

export default function Get() {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const messagesPerPage = 5;

  const fetchMessages = useCallback(async (startIndex:any, limit:any) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const guestbookContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("guestbookContract");
        console.log(guestbookContract);

        const entries = await guestbookContract.getEntries(0, 10);
        console.log("entries");
        console.log(entries);
        setMessages(entries);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchTotalMessages = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const guestbookContract = new ethers.Contract(contractAddress, abi, signer);

        const total = await guestbookContract.getTotalEntries();
        setTotalMessages(total.toNumber());
        fetchMessages(0, messagesPerPage); // Load first page
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  }, [fetchMessages]);

  useEffect(() => {
    fetchTotalMessages();
  }, [fetchTotalMessages]);

  const handleNextPage = () => {
    if ((currentPage + 1) * messagesPerPage < totalMessages) {
      setCurrentPage(currentPage + 1);
      fetchMessages((currentPage + 1) * messagesPerPage, messagesPerPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      fetchMessages((currentPage - 1) * messagesPerPage, messagesPerPage);
    }
  };

  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  return (
    <div>
      <ItemBackground>
        <ItemContainer>
          <ItemHeader>
            <ItemTitle>
              <label
                style={{
                  textShadow:
                    "1px 0px 0px black, 0px 1px 0px black, -1px 0px 0px black, 0px -1px 0px black",
                }}
              >
                All Messages
              </label>
            </ItemTitle>
          </ItemHeader>
          <ItemBody>
            <div className="container text-center">
              {totalMessages > 0 ? (
                <div>
                  <Table>
                    <thead>
                      <tr>
                        <TableHeader>User</TableHeader>
                        <TableHeader>Message</TableHeader>
                        <TableHeader>Timestamp</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((entry:any, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${entry.user.substring(0, 6)}...${entry.user.slice(-4)}`}</TableCell>
                          <TableCell>{entry.message}</TableCell>
                          <TableCell>{new Date(entry.timestamp * 1000).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                  <br />
                  <div>
                    <ItemAddMessageButton onClick={handlePrevPage} disabled={currentPage === 0}>
                      Prev
                    </ItemAddMessageButton>
                    <span><b>Page {currentPage + 1} / {totalPages}</b></span>
                    <ItemAddMessageButton onClick={handleNextPage} disabled={(currentPage + 1) * messagesPerPage >= totalMessages}>
                      Next
                    </ItemAddMessageButton>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", justifyContent: "center" }}>
                  <br />
                  <label style={{ fontSize: "20px", fontWeight: "400" }}>
                    There are no messages registered
                  </label>
                </div>
              )}
              <br />
            </div>
          </ItemBody>
        </ItemContainer>
      </ItemBackground>
    </div>
  );
}
