'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography, IconButton, Menu, MenuItem, Fade, } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [Inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
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

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handlers for navigating to different pages
  const goToInventory = () => {
    router.push('/dashboard/inventory');
    handleMenuClose();
  };

  const goToRecipes = () => {
    router.push('/dashboard/recipes');
    handleMenuClose();
  };

  const goToSignIn = () => {
    router.push('/dashboard/sign-in');
    handleMenuClose();
  };

  const goToSignOut = () => {
    router.push('/dashboard/sign-out');
    handleMenuClose();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
    >
      {/* Menu Component */}
      <Button
        id="fade-button"
        aria-controls={menuOpen ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={handleMenuClick}
      >
        Dashboard
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={goToInventory}>Inventory</MenuItem>
        <MenuItem onClick={goToRecipes}>Recipes</MenuItem>
        <MenuItem onClick={goToSignIn}>Sign-In</MenuItem>
        <MenuItem onClick={goToSignOut}>Sign-Out</MenuItem>
      </Menu>

      {/* Modal Component */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button 
        variant="contained" 
        onClick={handleOpen}
      > 
        Add New Item
      </Button>
      <Box border="1px solid #454">
        <Box 
          width="800px" 
          height="100px" 
          display="flex"
          bgcolor="#964B00" 
          alignItems="center" 
          justifyContent="center"
        >
          <Typography variant="h2" color="#FFF">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {Inventory.map(({ name, quantity }) => (
            <Box 
              key={name} 
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#343B00"
              padding={5}
            >
              <Typography 
                variant="h3" 
                color="#FFF" 
                textAlign="left"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h3" 
                color="#FFF" 
                textAlign="left"
              >
                {quantity}
              </Typography>
              <IconButton 
                aria-label="delete" 
                onClick={() => removeItem(name)}
              >
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
