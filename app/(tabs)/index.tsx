import {FlatList, Pressable, Text, View, Image, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {images, offers} from "@/constants";
import "../globals.css";
import cn from 'clsx';
import CartButton from "@/components/CartButton";
import {router, type Href} from "expo-router";

export default function Index() {
    const cardActions: Array<{ title: string; route?: Href }> = [
        { title: "ITEMS", route: "/search" },
        { title: "ORDERS", route: "/orders" },
        { title: "FULFILLMENT" },
        { title: "OTHER" },
    ];

  return (
      <SafeAreaView className="flex-1 bg-white">
          <FlatList
              data={offers}
              renderItem={({ item, index }) => {
                  const action = cardActions[index];
                  const handlePress = () => {
                      if (action && action.route) {
                          router.push(action.route);
                      }
                  };
                  return (
                      <View>
                          <Pressable
                                     className={cn("offer-card", "flex-row")}
                                     style={{ backgroundColor: item.color }}
                                     android_ripple={{color: "#fffff22"}}
                                     onPress={handlePress}
                          >
                              {action ? (
                                  <View className="flex-1 items-center justify-center gap-4 px-6">
                                      <Text className="text-3xl font-quicksand-bold text-white text-center tracking-wide">
                                          {action.title}
                                      </Text>
                                      <Image
                                          source={images.arrowRight}
                                          className="size-9"
                                          resizeMode="contain"
                                          tintColor="#ffffff"
                                      />
                                  </View>
                              ) : null}
                          </Pressable>
                      </View>

                  )

              }}
              contentContainerClassName="pb-28 px-5"
              ListHeaderComponent={() => (
                  <View className="flex-between flex-row w-full my-5 ">
                      <View className="flex-start">
                          <Text className="small-bold text-primary">DELIVER TO</Text>
                          <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                              <Text className="paragraph-bold text-dark-100">Babytuna</Text>
                              <Image source={images.arrowDown} className="size-3" resizeMode="contain"/>
                          </TouchableOpacity>
                      </View>
                      <CartButton/>
                  </View>
              )}

          />

      </SafeAreaView>

  );
}
