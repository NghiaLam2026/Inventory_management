// 'use client' directive for Next.js
'use client';

// Import necessary React hooks and Firebase functions
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, Modal, Stack, TextField, Button } from "@mui/material";
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

// Home component function
export default function Home() {
  
  // State hooks for inventory, modal visibility, item name, and search query
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to update the inventory from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Function to add an item to the inventory
  const addItem = async (item) => {
    if (!item) return; // Check if item is not empty

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  // useEffect hook to update the inventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  // Handlers for modal visibility and adding items
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAddItem = async () => {
    if (itemName.trim()) { // Ensure itemName is not empty
      await addItem(itemName);
      setItemName('');
      handleClose();
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render the component UI
  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" gap={2} flexDirection="column">
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400} bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button variant="outlined" onClick={handleAddItem}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: "#FEFAE0", color: "black"}}>
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ marginBottom: 2, width: '400px', bgcolor: "#FAEDCE", borderRadius: "10px"}}
      />
      <Box>
        <Box
          width="800px"
          height="100px"
          bgcolor="#FEFAE0"
          display="flex"
          justifyContent="center"
          alignItems="center">
          <Typography variant="h3" color="#333">Inventory Items</Typography>
        </Box>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {filteredInventory.map(({ name, quantity }) => (
          <Box 
            key={name} 
            width="100%" 
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#FAEDCE"
            padding={5}
          >
            <Typography variant="h3" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h3" color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => { addItem(name) }} sx={{ bgcolor: "#FEFAE0", color: "black", "&:hover": {bgcolor: "#FEFAE0"}}}>Add</Button>
              <Button variant="contained" onClick={() => { removeItem(name) } } sx={{ bgcolor: "#FEFAE0", color: "black", "&:hover": {bgcolor: "#FEFAE0"}}}>Remove</Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}