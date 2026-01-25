import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInput";
import { createMenuItem, getCategories } from "@/lib/api";
import useAppwrite from "@/lib/useFetch";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditItems = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    price: "",
    rating: "4.5",
    calories: "500",
    protein: "20",
    categoryId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useAppwrite({ fn: getCategories });

  const submit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.image_url ||
      !form.categoryId ||
      !form.price
    ) {
      return Alert.alert("Error", "Please fill required fields.");
    }

    setIsSubmitting(true);
    try {
      await createMenuItem({
        name: form.name,
        description: form.description,
        image_url: form.image_url,
        price: Number(form.price),
        rating: Number(form.rating),
        calories: Number(form.calories),
        protein: Number(form.protein),
        categoryId: form.categoryId,
      });
      Alert.alert("Success", "Item created.");
      setForm({
        name: "",
        description: "",
        image_url: "",
        price: "",
        rating: "4.5",
        calories: "500",
        protein: "20",
        categoryId: "",
      });
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to create item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5 pt-5">
        <CustomHeader title="Add Item" />

        <View className="gap-6">
          <CustomInput
            label="Name"
            placeholder="Classic Cheeseburger"
            value={form.name}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, name: text }))
            }
          />
          <CustomInput
            label="Description"
            placeholder="Beef patty, cheese, lettuce"
            value={form.description}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, description: text }))
            }
          />
          <CustomInput
            label="Image URL"
            placeholder="https://..."
            value={form.image_url}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, image_url: text }))
            }
          />
          <CustomInput
            label="Price"
            placeholder="25.99"
            value={form.price}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, price: text }))
            }
            keyboardType="numeric"
          />
          <CustomInput
            label="Category ID"
            placeholder="Paste a category id"
            value={form.categoryId}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, categoryId: text }))
            }
          />
          <CustomInput
            label="Rating"
            placeholder="4.5"
            value={form.rating}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, rating: text }))
            }
            keyboardType="numeric"
          />
          <CustomInput
            label="Calories"
            placeholder="500"
            value={form.calories}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, calories: text }))
            }
            keyboardType="numeric"
          />
          <CustomInput
            label="Protein"
            placeholder="20"
            value={form.protein}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, protein: text }))
            }
            keyboardType="numeric"
          />

          <CustomButton
            title="Create Item"
            onPress={submit}
            isLoading={isSubmitting}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditItems;
