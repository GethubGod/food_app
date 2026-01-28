import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInput";
import {
  createInventoryItem,
  updateInventoryItem,
  getInventoryItemById,
  deleteInventoryItem,
} from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Alert, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

const EditInventoryItem = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;

  const [form, setForm] = useState({
    name: "",
    category: "",
    image_url: "",
    base_unit: "",
    pack_unit: "",
    pack_size: "",
    par_level: "",
    lead_time_days: "",
    active: "true",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    setIsLoading(true);
    try {
      const item = await getInventoryItemById(id as string);
      setForm({
        name: item.name,
        category: item.category,
        image_url: item.image_url || "",
        base_unit: item.base_unit,
        pack_unit: item.pack_unit,
        pack_size: String(item.pack_size),
        par_level: String(item.par_level),
        lead_time_days: String(item.lead_time_days),
        active: String(item.active),
      });
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to load item");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async () => {
    if (
      !form.name ||
      !form.category ||
      !form.base_unit ||
      !form.pack_unit ||
      !form.pack_size ||
      !form.par_level ||
      !form.lead_time_days
    ) {
      return Alert.alert("Error", "Please fill all required fields.");
    }

    setIsSubmitting(true);
    try {
      const itemData = {
        name: form.name,
        category: form.category,
        image_url: form.image_url,
        base_unit: form.base_unit,
        pack_unit: form.pack_unit,
        pack_size: Number(form.pack_size),
        par_level: Number(form.par_level),
        lead_time_days: Number(form.lead_time_days),
        active: form.active === "true",
      };

      if (isEditMode && id) {
        await updateInventoryItem({ id: id as string, ...itemData });
        Alert.alert("Success", "Item updated successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await createInventoryItem(itemData);
        Alert.alert("Success", "Item created successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteInventoryItem(id as string);
              Alert.alert("Success", "Item deleted successfully.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (e: any) {
              Alert.alert("Error", e.message ?? "Failed to delete item");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="bg-white h-full">
        <View className="px-5 pt-5">
          <CustomHeader title="Loading..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-5 pt-5">
        <CustomHeader title={isEditMode ? "Edit Item" : "Add Item"} />

        <View className="gap-6 pb-10">
          <CustomInput
            label="Name *"
            placeholder="Tomatoes"
            value={form.name}
            onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          />
          <CustomInput
            label="Category *"
            placeholder="Prep, Cold, Dry, etc."
            value={form.category}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, category: text }))
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
            label="Base Unit *"
            placeholder="lb, each, oz, etc."
            value={form.base_unit}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, base_unit: text }))
            }
          />
          <CustomInput
            label="Pack Unit *"
            placeholder="case, box, bag, etc."
            value={form.pack_unit}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, pack_unit: text }))
            }
          />
          <CustomInput
            label="Pack Size *"
            placeholder="25"
            value={form.pack_size}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, pack_size: text }))
            }
            keyboardType="numeric"
          />
          <CustomInput
            label="Par Level *"
            placeholder="80"
            value={form.par_level}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, par_level: text }))
            }
            keyboardType="numeric"
          />
          <CustomInput
            label="Lead Time (Days) *"
            placeholder="2"
            value={form.lead_time_days}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, lead_time_days: text }))
            }
            keyboardType="numeric"
          />

          <CustomButton
            title={isEditMode ? "Update Item" : "Create Item"}
            onPress={submit}
            isLoading={isSubmitting}
          />

          {isEditMode && (
            <CustomButton
              title="Delete Item"
              onPress={handleDelete}
              isLoading={isDeleting}
              style="bg-red-500"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditInventoryItem;
