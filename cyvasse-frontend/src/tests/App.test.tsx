import { describe, expect, it, test } from "vitest";
import { fileCalc, rankCalc } from "@/lib/positionCalc";

import {render, screen} from "@testing-library/react"

import { ReservesDisplay } from "@/components/ReservesDisplay";

describe('App', () => {
    it("renders headline", () => {
        render(<ReservesDisplay 
            selectedReserve={() => {}}
            reserves={["B", "C"]}
            />);
    })
})
test("A test", () => {
    expect(fileCalc(4)).toBe(30)
})