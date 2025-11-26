"use client";

import AnimatedList from '@/components/AnimatedList'


const items = [
  'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5',
  'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'
];

export default function page() {
  return (
    <>
      <div
        className="flex flex-col items-center justify-start"
        style={{
          backgroundColor: "black",
          width: "100%",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          color: "white"
        }}
      >
        
        <h1 className="mt-10 mb-6 text-2xl">Customer Page</h1>

        <input
          placeholder="Suchleiste"
          className="mb-6 px-4 py-2 rounded-md text-black w-64"
          style={{
            border: "2px solid white",
          padding: "10px",
          borderRadius: "17px",
          background: "black",
          color: "white",
          outline: "none"
          }}
        />

        <AnimatedList
          items={items}
          onItemSelect={(item, index) => console.log(item, index)}
          showGradients={true}
          enableArrowNavigation={true}
          displayScrollbar={true}
        />

      </div>
    </>
  );
}
