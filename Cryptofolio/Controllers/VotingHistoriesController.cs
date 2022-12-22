using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cryptofolio.Data;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Query;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Deltas;
using Cryptofolio.Services;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VotingHistoriesController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public VotingHistoriesController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/VotingHistories
        [EnableQuery]
        [HttpGet("/odata/VotingHistories")]
        public ActionResult<List<VoteStatisticsDTO>> GetVotingHistories(string CoinSymbol)
        {
            if (_context.VotingHistories == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.VotingHistories != null && _userAuthService.getCurrentUserId() != null)
            {
               

                VoteStatisticsDTO voteStatisticsDTO = new VoteStatisticsDTO();

                voteStatisticsDTO.BullishCount = _context.VotingHistories.Where(cs => cs.CoinSymbol == CoinSymbol && cs.Date > DateTime.Now.AddDays(-1) && cs.Status == VoteStatus.Bullish).Count();

                voteStatisticsDTO.BearishCount = _context.VotingHistories.Where(cs => cs.CoinSymbol == CoinSymbol && cs.Date > DateTime.Now.AddDays(-1) && cs.Status == VoteStatus.Bearish).Count();

/*                var test = _context.VotingHistories.FirstOrDefaultAsync(cs => cs.CoinSymbol == CoinSymbol && cs.ApplicationUserId == _userAuthService.getCurrentUserId() && cs.Date > DateTime.Now.AddDays(-1));*/
                
                voteStatisticsDTO.CurrentUserVoted = _context.VotingHistories.FirstOrDefaultAsync(cs => cs.CoinSymbol == CoinSymbol && cs.ApplicationUserId == _userAuthService.getCurrentUserId() && cs.Date > DateTime.Now.AddDays(-1)) != null ? true : false;

/*                voteStatisticsDTO.Status = _context.VotingHistories.Where(cs => cs.CoinSymbol == CoinSymbol && cs.Date > DateTime.Now.AddDays(-1) && cs.ApplicationUserId == _userAuthService.getCurrentUserId() && cs.Status == VoteStatus.Bearish) != null ? VoteStatus.Bearish : VoteStatus.Unknown;

                voteStatisticsDTO.Status = _context.VotingHistories.Where(cs => cs.CoinSymbol == CoinSymbol && cs.Date > DateTime.Now.AddDays(-1) && cs.ApplicationUserId == _userAuthService.getCurrentUserId() && cs.Status == VoteStatus.Bullish) != null ? VoteStatus.Bullish : VoteStatus.Unknown;*/
                voteStatisticsDTO.Date = DateTime.Now;
                
                return Ok(voteStatisticsDTO);
            }
            else return BadRequest();
        }

        // GET: api/VotingHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VotingHistory>> GetVotingHistory(int id)
        {
            if (_context.VotingHistories == null)
            {
                return NotFound();
            }
            var votingHistory = await _context.VotingHistories.FindAsync(id);

            if (votingHistory == null)
            {
                return NotFound();
            }

            return votingHistory;
        }

        // PUT: api/VotingHistories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVotingHistory(int id, [FromODataBody] VotingHistoryDTO votingHistoryDTO)
        {
            VotingHistory? votingHistory = await _context.VotingHistories.FirstOrDefaultAsync(x => x.Id == id);

            if (votingHistory == null)
            {
                if (id != votingHistory.Id)
                {
                    return BadRequest();
                }
                votingHistory.Id = votingHistoryDTO.Id;
                votingHistory.Status= votingHistoryDTO.Status;
                votingHistory.Date = DateTime.Now;
                votingHistory.ApplicationUserId = votingHistoryDTO.ApplicationUserId;

                _context.Entry(votingHistory).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!VotingHistoriesExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

            }
            return NoContent();
        }

        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<VotingHistoryDTO> votingHistoryDTO)
        {
            if (_context.VotingHistories == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Comments'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.VotingHistories.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<VotingHistory> deltaVotingHistory = VotingHistoryDTO.toDeltaVotingHistory(votingHistoryDTO);

            deltaVotingHistory.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VotingHistoriesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(entity);

        }

        // POST: api/VotingHistories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/VotingHistories")]
        public async Task<ActionResult<VotingHistoryDTO>> PostVotingHistory(VotingHistoryDTO votingHistoryDTO)
        {
            if (_context.VotingHistories == null)
            {
                return Problem("Entity set 'ApplicationDbContext.VotingHistories'  is null.");
            }


            else if (_userAuthService.getCurrentUserId() != null)
            {

                Coin coins = _context.Coins.Find(votingHistoryDTO.CoinSymbol.ToString());

                if (coins == null)
                {

                    Coin coin = new Coin();

                    coin.Symbol = votingHistoryDTO.CoinSymbol.ToString();

                    _context.Coins.Add(coin);
                    await _context.SaveChangesAsync();
                }

                VotingHistory votingHistory = votingHistoryDTO.convertToVotingHistory();
                //TODO: Add IDs based on claims

                votingHistory.ApplicationUserId = _userAuthService.getCurrentUserId();
                votingHistory.Id = 0;
                votingHistory.Date = DateTime.Now;
                _context.VotingHistories.Add(votingHistory);
                await _context.SaveChangesAsync();


                votingHistoryDTO.Id = votingHistory.Id;
                votingHistoryDTO.ApplicationUserId = votingHistory.ApplicationUserId;
                votingHistoryDTO.Status = votingHistory.Status;
                votingHistoryDTO.Date = votingHistory.Date;
                votingHistoryDTO.CoinSymbol = votingHistory.CoinSymbol;
                return CreatedAtAction("GetVotingHistory", new { id = votingHistoryDTO.Id }, votingHistoryDTO);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/VotingHistories/5
        [EnableQuery]
        [HttpDelete("/odata/VotingHistories({id})")]
        public async Task<IActionResult> DeleteVotingHistory(int id)
        {
            if (_context.VotingHistories == null)
            {
                return NotFound();
            }
            var votingHistory = await _context.VotingHistories.FindAsync(id);
            if (votingHistory == null)
            {
                return NotFound();
            }

            _context.VotingHistories.Remove(votingHistory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VotingHistoriesExists(int id)
        {
            return (_context.VotingHistories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
