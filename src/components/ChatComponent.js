import React, { useState, useRef } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  const handleQuerySubmit = async () => {
    if (!inputText) {
      return;
    }

    // Update the chat with the user's message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        _id: Math.random().toString(36).substring(7),
        text: inputText,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "User",
        },
      },
    ]);

    try {
      const response = await fetch(
        "http://192.168.68.101:3000/parkingInfo/getParkingInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: inputText }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result.error) {
          console.error("Server error:", result.error);
          setResponseText(result.error); // Display the server error message
        } else {
          setResponseText(result.response);

          // Update the chat with the bot's response
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              _id: Math.random().toString(36).substring(7),
              text: result.response,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "Bot",
              },
            },
          ]);

          // Scroll to the bottom of the FlatList
          flatListRef.current.scrollToEnd({ animated: true });
        }
      } else {
        console.error(
          "Failed to fetch response. HTTP status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Clear the input text
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View
            style={item.user._id === 1 ? styles.userMessage : styles.botMessage}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        ListFooterComponent={
          <View
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          />
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={handleQuerySubmit} />
      </View>
      {responseText && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{responseText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userMessage: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-end",
    borderRadius: 8,
    margin: 5,
  },
  botMessage: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
    borderRadius: 8,
    margin: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
    paddingHorizontal: 8,
  },
  responseContainer: {
    padding: 10,
    backgroundColor: "#e0e0e0",
  },
  responseText: {
    fontSize: 16,
  },
});

export default ChatComponent;
