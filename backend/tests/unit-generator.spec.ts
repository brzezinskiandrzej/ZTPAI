import { generatePlaylistForMood } from "../src/services/playlist.generator";
import { AppDataSource } from "../src/database/config/data-source";
import { PlaylistSong } from "../src/models/PlaylistSong";
import { fx } from "./setup";

describe.skip("playlist.generator – jednostkowo", () => {

  it("gwarantuje dokładnie 5 pozycji", async () => {
    const pid = await generatePlaylistForMood(fx.user.user_id, {
      mood      : "happy",
      valenceMin: 0.7, valenceMax: 1,
      energyMin : 0.6, energyMax : 1,
      tempoMin  : 110, tempoMax  : 150,
      genres    : ["pop"], keys  : ["C"]
    } as any);

    const { count } = await AppDataSource
      .getRepository(PlaylistSong)
      .createQueryBuilder("ps")
      .select("COUNT(*)", "count")
      .where("ps.playlistPlaylistId = :pid", { pid })
      .getRawOne();

    expect(Number(count)).toBe(5);
  });
});
