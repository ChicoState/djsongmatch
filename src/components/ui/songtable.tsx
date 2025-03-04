export default function SongTable() {
    return (
        <div className="h-full grow-[4]">
        <table className="w-full border-collapse border border-gray-500">
          {/* Table column width */}
          <colgroup>
              <col className="w-6/12" />{/* Title: 5/12 of space */}
              <col className="w-4/12" />{/* Artist: 4/12 of space */}
              <col className="w-1/12" />{/* BPM: 1/12 of space */}
              <col className="w-1/12" />{/* Key: 2/12 of space */}
          </colgroup>
          {/* Table header */}
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Title</th>
              <th className="p-3 text-left border">Artist</th>
              <th className="p-3 text-left border">BPM</th>
              <th className="p-3 text-left border">Key</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {/* Empty rows to show the blank table structure */}
            {Array(10).fill(0).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border text-gray-500">-</td>
                <td className="p-3 border text-gray-500">-</td>
                <td className="p-3 border text-gray-500">-</td>
                <td className="p-3 border text-gray-500">-</td>
              </tr>
            ))}
            </tbody>
          </table>
      </div>
    )
}